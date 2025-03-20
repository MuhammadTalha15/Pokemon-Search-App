

const apiUrl = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon';

const form = document.getElementById('search-from');
const inputField = document.getElementById('search-input');
const button = document.getElementById('search-button');
const pokemonImageCont = document.getElementById('sprite-container');

const name_ID_Container = document.getElementById('name-and-id');

let currentPokemon;
let currentPokeUrl = null;
let pokeStats;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let userPoke = inputField.value.trim().toLowerCase();

    const getPoke = async () => {
        let response = await fetch(apiUrl,
            {
                headers: { 'Accept': 'application/json' }
            }
        );

        let pokemon = await response.json();

        let pokeName = null;
        let pokeId = null;
        for (let i = 0; i < pokemon.results.length; i++) {

            if (pokemon.results[i].name === userPoke || pokemon.results[i].id == userPoke) {
                pokeName = pokemon.results[i].name;
                pokeId = pokemon.results[i].id;
                currentPokeUrl = pokemon.results[i].url;
                break;
            }
        }

        if (!pokeName || !pokeId) {
            alert('Pokémon not found');
            return false
        }

        return true;
    }

    let found = await getPoke();
    if (!found) return;
    // PokeMon Stats

    const getPokeStats = async () => {
        const resStats = await fetch(currentPokeUrl,
            {
                headers: { 'Accept': 'application/json' }
            }
        );

        pokeStats = await resStats.json();

    }

    const createData = () => {
        document.getElementById('pokemon-name').innerText = pokeStats.name.toUpperCase();
        document.getElementById('pokemon-id').innerText = `#${pokeStats.id}`;
        document.getElementById('weight').innerText = `Weight: ${pokeStats.weight}`;
        document.getElementById('height').innerText = `Height: ${pokeStats.height}`;

        const typesContainer = document.getElementById('types');
        typesContainer.innerHTML = ''; 

        for (let i = 0; i < pokeStats.types.length; i++) {
            typesContainer.innerHTML += `<span class="type" id="type">${pokeStats.types[i].type.name}</span>`;
        }

        for (let i = 0; i < pokeStats.stats.length; i++) {
            document.getElementById(`${pokeStats.stats[i].stat.name}`).innerText = pokeStats.stats[i].base_stat;
        }
        
        pokemonImageCont.innerHTML = '';
        const image = document.createElement('img');
        image.classList.add('sprite');
        image.setAttribute('id', 'sprite');
        image.setAttribute('src', `${pokeStats.sprites.front_default}`);

        pokemonImageCont.appendChild(image);
    }


    await getPokeStats();
    await createData();
})