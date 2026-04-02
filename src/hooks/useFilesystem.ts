import { useCallback, useState } from 'react';
import {
  Filesystem,
  Directory,
  Encoding,
} from '@capacitor/filesystem';

export interface UseFilesystemResult {
  lastFilePath: string;
  lastContent: string;
  writing: boolean;
  reading: boolean;
  error: string | null;
  writeTextFile: (path: string, content: string) => Promise<void>;
  readTextFile: (path: string) => Promise<void>;
}

export const useFilesystem = (): UseFilesystemResult => {
  const [lastFilePath, setLastFilePath] = useState('test.txt');
  const [lastContent, setLastContent] = useState('');
  const [writing, setWriting] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const writeTextFile = useCallback(async (path: string, content: string) => {
    setWriting(true);
    setError(null);
    try {
      await Filesystem.writeFile({
        path,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      setLastFilePath(path);
      setLastContent(content);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setWriting(false);
    }
  }, []);

  const readTextFile = useCallback(async (path: string) => {
    setReading(true);
    setError(null);
    try {
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      setLastFilePath(path);
      setLastContent(result.data as string);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setReading(false);
    }
  }, []);

  return {
    lastFilePath,
    lastContent,
    writing,
    reading,
    error,
    writeTextFile,
    readTextFile,
  };
};
