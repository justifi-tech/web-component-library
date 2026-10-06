import { GrossVolumeReportDate } from "../../api/GrossVolume";
import { formatCurrency, formatDisplayDate } from "../../utils/utils";

export const generateChartOptions = (
  total: number,
  dates: GrossVolumeReportDate[],
  endDate: string
) => {
  return ({
    type: 'bar',
    options: {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: ['Trailing 30 Days', 'Gross Payments', formatCurrency(total)],
          position: 'top',
          align: 'start'
        },
        tooltip: {
          displayColors: false,
          intersect: false,
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              const date = formatDisplayDate(dates[index].date, endDate);
              const value = formatCurrency(dates[index].value)
              return [date, value]
            },
          }
        }
      },
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks: {
            callback: (index) => {
              if (index === 0 || index === dates.length - 1) {
                return formatDisplayDate(dates[index].date, endDate);
              }
            }
          }
        },
        y: {
          display: false
        }
      }
    },
    data: {
      labels: dates.map(() => ''),
      datasets: [
        {
          label: 'Gross Volume by Date',
          data: dates.map((date) => date.value)
        }]
    },
  });
}