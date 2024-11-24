import FileWriteBufferModule from './src/FileWriteBufferModule';
import { FileWriteBufferViewProps } from './src/FileWriteBuffer.types';

export function FileWriteBuffer(): string {
  return FileWriteBufferModule.FileWriteBuffer();
}

export { FileWriteBufferViewProps };
