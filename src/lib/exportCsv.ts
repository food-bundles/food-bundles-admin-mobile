import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** Writes a CSV string to a temp file and opens the OS share sheet. */
export async function shareCsv(fileName: string, csv: string): Promise<void> {
  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true });
  file.write(csv);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri);
  }
}
