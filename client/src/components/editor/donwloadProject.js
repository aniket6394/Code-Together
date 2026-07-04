import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadProject(files) {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.content);
  });

  const content = await zip.generateAsync({
    type: "blob",
  });

  saveAs(content, "project.zip");
}
