class PokeService{
    getPokemons = async (page) =>{
        const offset = (page - 1) * 10;
        const URL = `${process.env.REACT_APP_POKE_API_URL}pokemon/?limit=10&offset=${offset}`;
        return await fetch(URL)
        .then((response) => {
            return response.json()
        })
        .catch(error => {
            throw error;
        })
    }

    getPokemonById = async (pokemon) => {
        const URL = `${process.env.REACT_APP_POKE_API_URL}pokemon/${pokemon}`;
        return await fetch(URL)
        .then(response => {
            if(response.status === 200)
                return response.json();
            else return response;
        })
        .catch(error => {
            throw error
        })
    }
}
const pokeService = new PokeService();
export default pokeService;