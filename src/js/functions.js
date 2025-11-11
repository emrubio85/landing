"use stric";

/**
 * RENDER SINCRONICO 
 * @param {*} url 
 * @returns 
 */
let fetchProduct = (url) =>{
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Error de HTTP: $(response.status)')
        }

        return response.json();
    })
    .then (data => {
        return{
            success: true,
            body: data
        };
    })
    .catch ( error => {
        return{
            success:false,
            body:error.message
        };
    });
}

/**
 * RENDER ASINCRONICO
 * @param {*} url 
 * @returns 
 */
let fetchCategories = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok){
            throw new Error('Error HTTP: ${response.status}');
        }
        
        let text = await response.text();

        const parser = new DOMParser();
        const data = parser.parseFromString(text, "application/xml");

        return {
            success: true,
            body: data
        };
    } catch (error) {
        return {
            success: false,
            body: error.message
        };
    }
}

export {fetchProduct, fetchCategories}
