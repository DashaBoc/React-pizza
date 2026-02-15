import React from "react";
//import axios from "axios";
import qs from "qs";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchPizzas,
  selectPizza,
  selectPizzaData,
} from "../redux/slices/pizzaSlice";

import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";
import { list as sortList } from "../components/Sort";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Breadboard from "../components/PizzaBlock/Breadboard";
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);

  // const { searchValue, setSearchValue } = React.useContext(SearchContext); //UseContext примерно создает обработчик события, на изменения нашего контекста

  const onClickCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (page) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const search = searchValue ? `&search=${searchValue}` : "";
    const order = sort.order || "asc"; // добавьте, если есть поле order
    const sortBy = sort.sortProperty;
    const category = categoryId > 0 ? categoryId : "";

    //  try {
    //   const { data } = await axios.get(
    //     "https://686658fd89803950dbb25665.mockapi.io/item",
    //     {
    //       params: {
    //         page: currentPage,
    //         limit: 4,
    //         category: categoryId > 0 ? categoryId : "", //проверка для того, чтобы отображалась категория "все", с инлексом = 0: если категория > 0, то мы к строчке добавляем категорияИД, если нет, то пишем пустую строку
    //         search: searchValue || undefined,
    //         sortBy: sort.sortProperty,
    //         order: "desc", //делаем сортировку
    //       },

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage,
      }),
    );
  };

  React.useEffect(() => {
    if (isMounted.current) {
      const qeryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${qeryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);
  // Если первого рендера нет, то параметры в url  мы не вшиваем (по умолчанию у нас false => не вшиваем)

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = sortList.find(
        (obj) => obj.sortProperty === params.sortProperty,
      );

      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      );
      isSearch.current = true; // до того как выполнится второй useEffect мы заранее проверяем нужно ли делать поиск в url
    }
  }, []); // Если был первый рендер,  если у нас что-то поменялось в параметрах, если они при первом рендере были получены из адресной строчки, то тогда мы будем сохранять в редакс эти параметры

  React.useEffect(() => {
    window.scrollTo(0, 0); //Браузер сохраняет свой скролл, и при переходе на страницу мы эти делаем скролл вверх(при первом рендере говорим сделать скролл вверх)
    getPizzas();
    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]); // Если был первый рендер, то запрашиваем пиццы

  const pizass = items.map((obj) => (
    <Link key={obj.id} to={`pizza/${obj.id}`}>
      <PizzaBlock {...obj} />{" "}
    </Link>
  ));

  const skeletons = [...new Array(6)].map((_, index) => (
    <Breadboard key={index} />
  ));
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onClickCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😢</h2>
          <p>Не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizass}
        </div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
