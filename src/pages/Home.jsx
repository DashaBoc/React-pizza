import React from "react";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Breadboard from "../components/PizzaBlock/Breadboard";
import Pagination from "../components/Pagination";

export const Home = ({ searchValue }) => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortType, setSortType] = React.useState({
    name: "популярности",
    sortProperty: "rating",
  });
  //Создаём два стейта categoryId и sortType, для возможности в дальнейшем регулировать сортировку+категории

  React.useEffect(() => {
    setIsLoading(true);

    const search = searchValue ? `&search=${searchValue}` : "";

    fetch(
      `https://686658fd89803950dbb25665.mockapi.io/item?page=${currentPage}&limit=4&${
        categoryId > 0 ? `category=${categoryId}` : " " //проверка для того, чтобы отображалась категория "все", с инлексом = 0: если категория > 0, то мы к строчке добавляем категорияИД, если нет, то пишем пустую строку
      }&{search}&sortBy=${sortType.sortProperty}&order=desc` //делаем сортировку
    )
      .then((res) => res.json())
      .then((arr) => {
        setItems(arr);
        console.log(arr);
        setIsLoading(false);
      });
    window.scrollTo(0, 0); //Браузер сохраняет свой скролл, и при переходе на страницу мы эти делаем скролл вверх(при первом рендере говорим сделать скролл вверх)
  }, [categoryId, sortType, searchValue, currentPage]);

  console.log(categoryId, sortType);

  const pizass = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  // .filter((obj) => {
  //   if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
  //     return true;
  //   }
  //   return false;
  // })  - этот способ без помощи бекенда. //Мы совершаем поиск по объектам, приводя всё к одному регистру, затем просим отобразить, если есть сходства с написанным.

  const skeletons = [...new Array(6)].map((_, index) => (
    <Breadboard key={index} />
  ));
  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onClickCategory={(i) => setCategoryId(i)}
        />
        <Sort value={sortType} onChangeSort={(i) => setSortType(i)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizass}</div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  );
};

export default Home;
