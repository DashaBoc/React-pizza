import React from "react";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Breadboard from "../components/PizzaBlock/Breadboard";

export const Home = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("https://686658fd89803950dbb25665.mockapi.io/item")
      .then((res) => res.json())
      .then((arr) => {
        setItems(arr);

        setIsLoading(false);
      });
    window.scrollTo(0, 0); //Браузер сохраняет свой скролл, и при переходе на страницу мы эти делаем скролл вверх(при первом рендере говорим сделать скролл вверх)
  }, []);
  return (
    <div className="container">
      <div className="content__top">
        <Categories />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(6)].map((_, index) => <Breadboard key={index} />)
          : items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)}
      </div>
    </div>
  );
};

export default Home;
