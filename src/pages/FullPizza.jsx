import axios from "axios";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const FullPizza = () => {
  const [pizza, setPizza] = React.useState();
  const { id } = useParams(); // используем чтобы оповестить компонент, что нужно сделать перерисовку, и вернуть в переменную динамические параметры, если они будут у нас содержаться(динамические - те, которые начинаются с : и названия переменной)
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          "https://686658fd89803950dbb25665.mockapi.io/item/" + id,
        );
        setPizza(data);
      } catch (error) {
        alert("Ошибка при получении пиццы!");
        navigate("/");
      }
    }
    fetchPizza();
  }, []);

  if (!pizza) {
    return "Загрузка...";
  }
  return (
    <div className="container">
      <img src={pizza.imageUrl} />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} P </h4>
    </div>
  );
};

export default FullPizza;
