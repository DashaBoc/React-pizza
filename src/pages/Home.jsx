import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { setCategoryId, setCurrentPage } from "../redux/slices/filterSlice";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Breadboard from "../components/PizzaBlock/Breadboard";
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";

export const Home = () => {
  const dispatch = useDispatch();
  const { categoryId, sort, currentPage } = useSelector(
    (state) => state.filter
  );

  const { searchValue, setSearchValue } = React.useContext(SearchContext); //UseContext примерно создает обработчик события, на изменения нашего контекста
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onClickCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };
  // const onChangeSort = (id) => {
  //   dispatch(setSort(id));
  // };

  React.useEffect(() => {
    setIsLoading(true);

    const search = searchValue ? `&search=${searchValue}` : "";

    axios
      .get("https://686658fd89803950dbb25665.mockapi.io/item", {
        params: {
          page: currentPage,
          limit: 4,
          category: categoryId > 0 ? categoryId : "", //проверка для того, чтобы отображалась категория "все", с инлексом = 0: если категория > 0, то мы к строчке добавляем категорияИД, если нет, то пишем пустую строку
          search: searchValue || undefined,
          sortBy: sort.sortProperty,
          order: "desc", //делаем сортировку
        },
      })
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });

    window.scrollTo(0, 0); //Браузер сохраняет свой скролл, и при переходе на страницу мы эти делаем скролл вверх(при первом рендере говорим сделать скролл вверх)
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  //console.log(categoryId, sortType);

  const pizass = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

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
      <div className="content__items">{isLoading ? skeletons : pizass}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
