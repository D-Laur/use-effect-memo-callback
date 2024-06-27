import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";

function App() {
  const [count, setCount] = useState(1);

  const fetchSomeData = async (number: number): Promise<any> => {
    console.log("This function is re-created every time the component renders");

    // set timeout to simulate a slow network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return fetch(`https://jsonplaceholder.typicode.com/todos/${number}`)
      .then((response) => response.json())
      .then((json) => json);
  };

  const fetchMemorized = useCallback(async (number: number) => {
    console.log(
      "This function is memorized and only re-created when the dependencies change"
    );

    // set timeout to simulate a slow network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return fetch(`https://jsonplaceholder.typicode.com/todos/${number}`)
      .then((response) => response.json())
      .then((json) => json);
  }, []);

  const person = {
    name: "John",
    age: count,
  };

  const memorizedPerson = useMemo(() => {
    return {
      name: "John",
      age: count,
    };
  }, []);

  return (
    <div>
      <h1>useMemo, useCallback, useEffect</h1>

      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>Increase Count</button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <div>
          <h4>Person Object</h4>
          <p>
            Name: {person.name}, Age: {person.age}
          </p>
        </div>

        <div>
          <h4>Memorized Person Object</h4>
          <p>
            Name: {memorizedPerson.name}, Age: {memorizedPerson.age}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          width: "100%",
        }}
      >
        <FetchDataComponent
          title={"async function"}
          number={count}
          fetcher={fetchSomeData}
        />

        <FetchDataComponent
          title={"useCallback"}
          number={count}
          fetcher={fetchMemorized}
        />
      </div>
    </div>
  );
}

function FetchDataComponent({
  title,
  number,
  fetcher,
}: {
  title: string;
  number: number;
  fetcher: (number: number) => Promise<unknown>;
}) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetcher(number).then((data) => {
      setData(data);
      setLoading(false);
    });

    return () => {
      console.log(`Cleanup ${title}`);
    };
  }, [fetcher]);

  return (
    <div style={{ width: "100%" }}>
      <h2>Data Fetching with {title}</h2>

      {loading ? "Loading..." : <pre>{JSON.stringify(data, null, 2)}</pre>}

      <p>Count: {number}</p>
    </div>
  );
}

export default App;
