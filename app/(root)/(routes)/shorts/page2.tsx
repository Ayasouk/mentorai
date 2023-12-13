"use client"
// ShortsPage.tsx

import axios from 'axios';
import React, { useState } from 'react';

const ShortsPage: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [videoSrc, setVideoSrc] = useState<string>('');

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Créer un objet FormData pour la vidéo
      const formData = new FormData();
      formData.append('file', file);

      // Configuration Axios pour la requête POST
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
        // Ajouter un timeout suffisamment long pour les gros fichiers
        timeout: 600000, // 10 minutes
      };

      // Faire la requête POST avec axios
      const response = await axios.post('/api/shorts', formData, config);

      // Utiliser la réponse ici...
      console.log(response.data.url);
      setVideoSrc(response.data.url);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      // Traitez l'erreur comme nécessaire
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div>Shorts Page</div>
      <div>URL : {videoSrc}</div>
      <input
        type="file"
        className="w-30 m-6"
        onChange={handleChange}
        placeholder="Choisir votre vidéo"
      />
      <div>Progression de l'upload: {uploadProgress}%</div>
      {videoSrc && (
        <video className="w-7/12 h-7/12" controls>
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default ShortsPage;
