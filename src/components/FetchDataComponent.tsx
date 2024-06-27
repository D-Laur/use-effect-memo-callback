import { useEffect, useState } from 'react';

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
    fetcher(number).then((data) => {
      setData(data);
      setLoading(false);
    })

    return () => {
      console.log(`Cleanup ${title}`);
    };
  }, [fetcher]);

  return (
    <div>
      <h2>Data Fetching with {title}</h2>
      {loading ? 'Loading...' : <pre>{JSON.stringify(data, null, 2)}</pre>}
      <p>Count: {number}</p>
    </div>
  );
}

export default FetchDataComponent;
