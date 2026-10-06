import { DisputeEvidenceDocument, DisputeEvidenceDocumentType } from "../../../api/DisputeEvidenceDocument";

const fileInputHandler = (e: InputEvent, documentState) => {
  const target = e.target as HTMLInputElement;
  const name = target.name as DisputeEvidenceDocumentType;
  const files = target.files as unknown as File[];
  documentState[name] = [];

  for (const file of files) {
    documentState[name].push(new DisputeEvidenceDocument(file, name));
  }
}

export default fileInputHandler;