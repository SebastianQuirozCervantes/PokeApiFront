import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from 'react';
import PokeService from "./services/poke";
import PokeApiImg from "./assets/img/pokeapi.png"
import PikachuImg from "./assets/img/pikachu.png";
import Swal from "sweetalert2";
import './App.scss';

function App() {
  const [pokemon, setPokemon] = useState('');
  const [pokemons, setPokemons] = useState('');
  const [loadModal, setLoadModal] = useState(false);
  const [pokemonFoundModal, setPokemonFoundModal] = useState(false);
  const [pokemonFound, setPokemonFound] = useState(null);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    setLoadModal(true);
    setPokemons(null)
    PokeService.getPokemons(page).then(result => {
      setPokemons(result);
      setLoadModal(false);
    }).catch(error => {
      console.log("ERROR : ", error)
    })
  },[page])
  const searchPokemon = (elememt) => {
    if(elememt !== ''){
      setLoadModal(true);
      PokeService.getPokemonById(elememt).then(result => {
        if(result.abilities){
          setPokemonFound(result);
          setPokemonFoundModal(true);
          Toast.fire({
            icon: 'success',
            title: 'Pokemon encontrado :)'
          })
        }else{
          Toast.fire({
            icon: 'error',
            title: 'Pokemon no encontrado :('
          })
        }
        setLoadModal(false);
        setPokemon('');
      }).catch(error => {
        console.log(error)
        setLoadModal(false);
      })
    }else{
      Toast.fire({
        icon: 'error',
        title: 'No ingresaste nada :('
      })
    }
  }
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  return (
    <div className="home">
      <div className='header'>
          <img src={PokeApiImg} alt="PokéAPI" className='header__img'/>
      </div>
      <div className='container__pokemon'>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            <div className='title__container'>
              <p className='title__text'>Pokemon</p>
              <img className="title__img" src={PikachuImg} alt="Pikachu"/>
            </div>
          </Form.Label>
        <div className='input__container'>
          <Form.Control type="pokemon" placeholder="Ingresar pokemon" value={pokemon} onChange={(e) => setPokemon(e.target.value)}/>
          <Button  variant="danger" onClick={() => searchPokemon(pokemon)}>Buscar</Button>
        </div>
        <Form.Text className="text-muted">
          Escribe el pokemon que deseas ver.
        </Form.Text>
        </Form.Group>
        <Table striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            { pokemons?.results ?
              pokemons?.results?.map((pokemon, index) => {
                return (
                  <tr style={{cursor: "pointer"}} key={index} onClick={() => searchPokemon(pokemon?.name)}>
                    <td> { ((page - 1 ) * 10) + index + 1 }</td>
                    <td>{ pokemon?.name}</td>
                  </tr>
                )
              })
              : <tr> <td colSpan="2" style={{textAlign: 'center'}}>Cargando ...</td></tr>
            }
          </tbody>
        </Table>
        <div className='buttons__container'>
          <Button variant="danger" disabled={pokemons?.previous ? false : true} onClick={() => setPage(page - 1)}>Anterior</Button>
          <Button variant="danger" disabled={pokemons?.next ? false : true} onClick={() => setPage(page + 1)}>Siguiente</Button>
        </div>
      </div>
      <div>
      </div>
      <div style={{display:"flex", width: "100%", justifyContent: "right"}}>
        <p >Sebastian Quiroz Cervantes</p>
      </div>
      <Modal show={loadModal} fullscreen={'md-down'} >
        <Spinner animation="grow" variant="danger" />
        <p style={{fontSize:"30px", marginBottom: 0}}>Cargando </p>
      </Modal>
      <Modal show={pokemonFoundModal}>
        <Modal.Dialog style={{backgroundColor: "white", margin:0, width: "100%"}}>
          <Modal.Header closeButton style={{width: "100%"}} onHide={() => setPokemonFoundModal(false)}>
            <Modal.Title>{pokemonFound?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{width: "100%"}}>
            <div style={{display: "flex"}}>
              <div>
                <p>Experiencia al derrotarlo: {pokemonFound?.base_experience}</p>
                <p>Altura: {pokemonFound?.height} dm.</p>
                <p>Peso: {pokemonFound?.weight} hg.</p>
                <p>Predeterminado: {pokemonFound?.is_default ? 'Si' : 'No'}</p>
                <p>Orden: {pokemonFound?.order} </p>
              </div>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonFound?.id}.png`} style={{width:"50%"}} alt="Pokemon"/>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </div>
  );
}

export default App;
