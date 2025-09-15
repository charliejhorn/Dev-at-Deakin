export function uploadImage(imageFile) {
    return new Promise((resolve, reject) => {
        // use FileReader to convert the file to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1]; // remove data:image/...;base64, prefix
            const formData = new FormData();
            formData.append('image', base64data);

            const apiKey = process.env.REACT_APP_IMGBB_API_KEY;
            const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(resolve)
                .catch(error => {
                    console.error('Image upload failed:', error);
                    reject(error);
                });
        };
        reader.onerror = error => {
            console.error('File reading failed:', error);
            reject(error);
        };
        reader.readAsDataURL(imageFile);
    });
}
