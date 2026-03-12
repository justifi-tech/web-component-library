#!/bin/bash

cd "$(dirname "$0")"

# Defaults
MAX_CYCLES=5
CYCLE=0
AUDIT_MODE="ready"  # ready | full | skip
MODEL_IMPLEMENT="claude-sonnet-4-5-20250929"
MODEL_AUDIT="claude-opus-4-6"
MODEL_REVIEW="claude-haiku-4-5-20251001"

# Parse flags
while [[ $# -gt 0 ]]; do
    case $1 in
        --full-audit)  AUDIT_MODE="full"; shift ;;
        --skip-audit)  AUDIT_MODE="skip"; shift ;;
        *) echo "Unknown flag: $1"; echo "Usage: ./loop.sh [--full-audit | --skip-audit]"; exit 1 ;;
    esac
done

echo "=== Audit mode: ${AUDIT_MODE} ==="

# Check output file for fatal errors. Returns 0 if fatal error found.
check_fatal_error() {
    local file="$1"
    local phase="$2"

    # Token/usage limit reached (empty output or explicit limit message)
    if [ ! -s "$file" ] || grep -q 'Limit reached' "$file"; then
        echo "=== Token limit reached during ${phase} ==="
        return 0
    fi

    # API rate limit
    if grep -q '"error":"rate_limit"' "$file"; then
        echo "=== API rate limit reached during ${phase} ==="
        return 0
    fi

    # API server errors
    if grep -q 'API Error: 5[0-9][0-9]' "$file" || grep -q '"type":"api_error"' "$file"; then
        echo "=== API error during ${phase} ==="
        echo "Check $file for details"
        return 0
    fi

    # is_error flag on the final result line (not tool results mid-conversation)
    if grep '"type":"result"' "$file" | grep -q '"is_error":true'; then
        echo "=== Error during ${phase} ==="
        echo "Check $file for details"
        return 0
    fi

    return 1
}

while [ $CYCLE -lt $MAX_CYCLES ]; do
    CYCLE=$((CYCLE + 1))
    TASK_NUM=0

    echo "=== Cycle ${CYCLE}/${MAX_CYCLES} ==="

    # Step 1: Review intake — process specd_review.md into specd_work_list.md
    echo "=== Review intake ==="
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    REVIEW_OUTPUT="/tmp/${PWD##*/}-review-${TIMESTAMP}.txt"

    cat .claude/commands/specd/review-intake.md | claude -p \
        --model "$MODEL_REVIEW" \
        --dangerously-skip-permissions \
        --output-format=stream-json \
        --verbose \
        | tee "$REVIEW_OUTPUT" \
        | npx repomirror visualize

    if check_fatal_error "$REVIEW_OUTPUT" "review intake"; then
        exit 1
    fi

    # Step 2: Implement loop — work through specd_work_list.md one item at a time
    while true; do
        TASK_NUM=$((TASK_NUM + 1))
        TIMESTAMP=$(date +%Y%m%d-%H%M%S)
        OUTPUT_FILE="/tmp/${PWD##*/}-impl-${TIMESTAMP}-${TASK_NUM}.txt"

        echo "=== Cycle ${CYCLE} — Task ${TASK_NUM} ==="

        cat .claude/commands/specd/implement.md | claude -p \
            --model "$MODEL_IMPLEMENT" \
            --dangerously-skip-permissions \
            --output-format=stream-json \
            --verbose \
            | tee "$OUTPUT_FILE" \
            | npx repomirror visualize

        if check_fatal_error "$OUTPUT_FILE" "implement task ${TASK_NUM}"; then
            exit 1
        fi

        if grep '"type":"result"' "$OUTPUT_FILE" | grep -q 'LOOP_COMPLETE: true'; then
            echo "=== All work items complete ==="
            break
        fi

        sleep 2
    done

    # Step 3: Audit
    if [ "$AUDIT_MODE" = "skip" ]; then
        echo "=== Audit skipped (--skip-audit) ==="
        echo "=== Loop complete after ${CYCLE} cycle(s) ==="
        exit 0
    fi

    AUDIT_CMD="specd/audit.md"
    if [ "$AUDIT_MODE" = "full" ]; then
        AUDIT_CMD="specd/full-audit.md"
    fi

    echo "=== Audit phase (${AUDIT_MODE}) ==="
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    AUDIT_OUTPUT="/tmp/${PWD##*/}-audit-${TIMESTAMP}.txt"

    cat ".claude/commands/${AUDIT_CMD}" | claude -p \
        --model "$MODEL_AUDIT" \
        --dangerously-skip-permissions \
        --output-format=stream-json \
        --verbose \
        | tee "$AUDIT_OUTPUT" \
        | npx repomirror visualize

    if check_fatal_error "$AUDIT_OUTPUT" "audit"; then
        exit 1
    fi

    # If audit found nothing new, we're done
    if grep '"type":"result"' "$AUDIT_OUTPUT" | grep -q 'AUDIT_CLEAN: true'; then
        echo "=== Audit clean — nothing new found ==="
        echo "=== Loop complete after ${CYCLE} cycle(s) ==="
        exit 0
    fi

    echo "=== Audit found new items — starting cycle $((CYCLE + 1)) ==="
    sleep 2
done

echo "=== Cycle cap (${MAX_CYCLES}) reached — check specd_work_list.md and specd_review.md ==="
exit 0
