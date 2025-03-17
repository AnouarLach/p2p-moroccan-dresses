export default function Home({ jurken }) {
    return (
      <div>
        <h1>Marokkaanse Jurken</h1>
        <ul>
          {jurken.map((jurk) => (
            <li key={jurk.id}>{jurk.naam} - €{jurk.prijs}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export async function getServerSideProps() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jurken`);
    const jurken = await res.json();
    return { props: { jurken } };
  }
  
