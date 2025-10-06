"use client";

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!(file instanceof File)) {
            reject(new TypeError("expected a File instance"));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === "string") {
                const [, encoded] = result.split(",");
                resolve(encoded || "");
            } else {
                resolve("");
            }
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsDataURL(file);
    });
}
