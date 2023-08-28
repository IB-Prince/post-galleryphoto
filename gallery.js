const imageContainer = document.getElementById('imageContainer');

    // Fetch gallery images and display them
    fetch('http://localhost:3000/gallery')
      .then(response => response.json())
      .then(images => {
        images.forEach(image => {
          const imgElement = document.createElement('img');
          imgElement.src = image.imageUrl;
          imageContainer.appendChild(imgElement);
        });
      })
      .catch(error => {
        console.error('Error fetching gallery images:', error);
      });