// import { useGlobalContext } from "@/context/Store";

// export async function fetchMaticPrice() {
//   const { setMaticPrice } = useGlobalContext();
//   try {
//     // Fetch MATIC price
//     const maticDataResponse = await fetch(
//       `https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
//     );
//     if (!maticDataResponse.ok) {
//       throw new Error("Failed to fetch MATIC price");
//     }
//     const maticData = await maticDataResponse.json();
//     const maticPrice = parseFloat(maticData.result.maticusd);
//     if (isNaN(maticPrice)) {
//       throw new Error("Invalid MATIC price data");
//     }

//     setMaticPrice(maticPrice.toFixed(4));

//     return;
//   } catch (error) {
//     console.error("Error fetching prices:", error);
//     return { error: error.message };
//   }
// }
