import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_ERROR,
} from "../actions";

//product reduces is used to reduce the logic and parameters passed when dealing with products and display in the app
const products_reducer = (state, action) => {
  if (action.type === SIDEBAR_OPEN) {
    // upon sidebar open set the sidebar to true to show it
    return { ...state, isSidebarOpen: true };
  }
  if (action.type === SIDEBAR_CLOSE) {
    // upon sidebar close set the sidebar to false to hide it
    return { ...state, isSidebarOpen: false };
  }
  if (action.type === GET_PRODUCTS_BEGIN) {
    //start fetching for products set loading to true
    return { ...state, products_loading: true };
  }
  if (action.type === GET_PRODUCTS_SUCCESS) {
    // successful fetch of the products will pull the featured ones with mapping
    const featured_products = action.payload.filter(
      (product) => product.featured === true
    );

    return {
      ...state,
      products: action.payload,
      products_loading: false,
      featured_products,
    };
  }
  if (action.type === GET_PRODUCTS_ERROR) {
    // error occured during the fetch for products
    return { ...state, products_loading: false, products_error: true };
  }

  if (action.type === GET_SINGLE_PRODUCT_BEGIN) {
    //start fetching the single product
    return {
      ...state,
      single_product_loading: true,
      single_product_error: false,
    };
  }
  if (action.type === GET_SINGLE_PRODUCT_SUCCESS) {
    // single product fetch success
    return {
      ...state,
      single_product_loading: false,
      single_product: action.payload,
    };
  }
  if (action.type === GET_SINGLE_PRODUCT_ERROR) {
    // error on single product fetch
    return {
      ...state,
      single_product_loading: false,
      single_product_error: true,
    };
  }

  // throw error exception if something unexpected happens
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default products_reducer;
