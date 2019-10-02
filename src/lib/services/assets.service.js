/**
 * Paths to images contained in the asset folder
 */
module.exports = {
    /**
     * URL of images in the ```assets/images``` folder
     */
    get: {
        medication: {
            carbidopaLebodopa: {
                '25_100': 'medication/carbidopa-lebodopa_25_100_mg.jpg',
                '25_250': 'medication/carbidopa-lebodopa_25_250_mg.jpg'
            },
            sinemet: {
                '10_100': 'medication/sinemet_10_100_mg.jpg',
                '25_100': 'medication/sinemet_25_100_mg.jpg',
                '25_250': 'medication/sinemet_25_250_mg.jpg'
            },
            sinemet_cr: {
                '25_100': 'medication/sinemet-cr_10_100_mg.jpg',
                '50_200': 'medication/sinemet-cr_10_100_mg.jpg'
            }
        }
    },
    /**
     * Wrap a given url to redirect to the assets folder
     * @param {string} url
     * @returns {string} wrapped url 
     */
    wrapImageUrl: function(url) {
        return 'assets/images/' + url;
    }
}