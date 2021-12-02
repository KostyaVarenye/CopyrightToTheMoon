import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const CreateLeaseForm = () => {
  useEffect(() => {
    //handleCreate();
  }, []);

  //state of the form inputs
  const [state, setState] = useState({
    artist: "",
    name: "",
    url: "",
    price: "",
    album: "",
    genre: "",
    contractAddress: "",
  });

  const handleCreate = async ({
    artist,
    name,
    url,
    price,
    album,
    genre,
    contractAddress,
  }) => {
    price = price + "00";
    try {
      //post to the server with create intent
      const data = await axios.post(
        "http://localhost:8888/api/3-create-new-song",
        JSON.stringify({
          name: name,
          url: url,
          price: price,
          artist: artist,
          album: album,
          genre: genre,
          contractAddress: contractAddress,
        })
      );
      // CREATE COMPLETE - state reset
      setState({
        artist: "",
        name: "",
        url: "",
        price: "",
        album: "",
        genre: "",
        contractAddress: "",
      });
      alert("Thank you, license created.");
    } catch (error) {
      console.log(error);
    }
  };
  // change handler for the inputs
  const handleChange = (e) => {
    const value = e.target.value;

    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // PAY METAMASK

    // CREATE
    handleCreate(state);
    //console.log(artist, name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Form Creation</h4>
      <label>
        Aritst
        <input
          type="text"
          name="artist"
          value={state.artist}
          onChange={handleChange}
        />
      </label>
      <label>
        Song name
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
        />
      </label>
      <label>
        URL
        <input
          type="text"
          name="url"
          value={state.url}
          onChange={handleChange}
        />
      </label>
      <label>
        Album name
        <input
          type="text"
          name="album"
          value={state.album}
          onChange={handleChange}
        />
      </label>
      <label>
        Genre
        <input
          type="text"
          name="genre"
          value={state.genre}
          onChange={handleChange}
        />
      </label>
      <label>
        Price in $:
        <input
          type="text"
          name="price"
          value={state.price}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleSubmit} type="submit">
        Create
      </button>
    </form>
  );
};

export default CreateLeaseForm;
