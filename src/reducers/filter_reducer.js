import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

//filter reduces used for filtering items, to reduce the parameters and logic passed between internal program parts
const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    //ACHTUNG!!!! if i dont use spread operator with all products the app crashes, probably something with js functionality ?! something to do with pointer in js that points to the same object which in our case is []
    let maxPrice = action.payload.map((p) => p.price);
    //we use Math js to get max number, and destructure the array into it
    maxPrice = Math.max(...maxPrice);
    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  //update the sort method
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  //sort the products by the sort prop
  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    let tempProducts = [...filtered_products];
    // lets say we have (1,4,-5, 3) then we get : -5, 1, 3, 4
    if (sort === "price-lowest") {
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-highest") {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
    if (sort === "name-a") {
      tempProducts = tempProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sort === "name-z") {
      tempProducts = tempProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
    return { ...state, filtered_products: tempProducts };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    //setting name property dynamically, *just like in SHMYTHON
    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, artist, album, genre, price } = state.filters;
    let tempProducts = [...all_products];
    //filtering our products
    if (text) {
      //filter by text
      tempProducts = tempProducts.filter((product) => {
        return product.name.toLowerCase().startsWith(text);
      });
    }
    //artist
    if (artist !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.artist === artist
      );
    }
    //album
    if (album !== "all") {
      tempProducts = tempProducts.filter((product) => product.album === album);
    }
    //genres #Broken
    if (genre !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.genre === genre;
      });
    }

    //price
    tempProducts = tempProducts.filter((product) => product.price <= price);

    return { ...state, filtered_products: tempProducts };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        artist: "all",
        album: "all",
        genre: "all",
        price: state.filters.max_price,
      },
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
