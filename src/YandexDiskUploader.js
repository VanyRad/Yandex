import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const YandexDiskUploader = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = async () => {
    try {
      const responses = await Promise.all(
        files.map((file) =>
          axios.post('https://cloud-api.yandex.net/v1/disk/resources/upload', {
            path: file.name,
            url: 'https://cloud-api.yandex.net/v1/disk/resources/upload',
            method: 'GET',
          })
        )
      );

      const uploadUrls = responses.map((response) => response.data.href);

      await Promise.all(
        files.map((file, index) => axios.put(uploadUrls[index], file))
      );

      alert('Файлы успешно загружены на Яндекс.Диск!');
      setFiles([]);
    } catch (error) {
      console.error('Ошибка при загрузке файлов:', error);
      alert('Произошла ошибка при загрузке файлов на Яндекс.Диск.');
    }
  };

  const handleFileDrop = (acceptedFiles) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, 100);
    setFiles(newFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    multiple: true,
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <button>Перетащите файлы сюда или кликните, чтобы выбрать файлы для загрузки.</button>
      </div>
      {files.length > 0 && (
        <div>
          <h2>Выбранные файлы:</h2>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
          <button onClick={handleFileUpload}>Загрузить на Яндекс.Диск</button>
        </div>
      )}
      {files.length > 0 && (
        <div>
          <h2>Список всех выбранных файлов ({files.length}):</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YandexDiskUploader;







