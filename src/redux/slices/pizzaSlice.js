import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzasStatus', async (params, thunkAPI) => {
  const { sortBy, order, category, search, currentPage } = params;
  const { data } = await axios.get('https://686658fd89803950dbb25665.mockapi.io/item', {
    params: {
      page: currentPage,
      limit: 4,
      category: category > 0 ? category : '', //проверка для того, чтобы отображалась категория "все", с инлексом = 0: если категория > 0, то мы к строчке добавляем категорияИД, если нет, то пишем пустую строку
      search: search || undefined,
      sortBy,
      order: 'desc',
    },
  });

  return data;
});

const initialState = {
  items: [],
  status: 'loading', //loading | success | error
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPizzas.pending, (state) => {
      state.status = 'loading';
      state.items = [];
      console.log('Идет отправка');
    });
    builder.addCase(fetchPizzas.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'success';
      console.log(state, 'Good');
    });
    builder.addCase(fetchPizzas.rejected, (state, action) => {
      state.status = 'error';
      state.items = [];
      console.log('Была ошибка');
    });
  },
}); // Reducers указывает как менять state, когда произошло событие (?)

export const selectPizzaData = (state) => state.pizza;

export const { setItems } = pizzaSlice.actions;
export default pizzaSlice.reducer;
