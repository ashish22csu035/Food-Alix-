import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect} from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const useOnlineStatus = ()=>{
  const [onlineStatus,setOnlineStatus]= useState(true);
  useEffect(()=>{
    window.addEventListener("offline",()=>{
      setOnlineStatus(false);
    });
    window.addEventListener("online",()=>{
      setOnlineStatus(true);
    }) ;

    },[]);
  return onlineStatus;
  
};






const RestaurantMenu = ()=>{
  const [resInfo,setResInfo]=useState(null);

const {resId} = useParams();



useEffect(()=>{fetchMenu();},
[]);

const fetchMenu = async()=>{
  const data= await fetch("https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.3938402&lng=77.3048001&restaurantId=" + resId + "&catalog_qa=undefined&submitAction=ENTER");

  const json = await data.json();
  console.log(json);
  setResInfo(json);


};


const {name,cuisines,avgRating,areaName,costForTwoMessage} = resInfo?.data?.cards?.[2]?.card?.card?.info || "Loading...";
const itemCards = resInfo?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[1]?.card?.card?.itemCards || [];




  return(
    <div className="menu">
      <h1>{name}</h1>
      <p>{cuisines?.join(", ")}-{costForTwoMessage}</p>
      <h3>{avgRating}</h3>
      <h4>{areaName}</h4>
      
      <ul>
        {itemCards.map((item) => (
  <li key={item.card.info.id}>
    {item.card.info.name} - ₹{(item.card.info.price || item.card.info.defaultPrice) / 100}
  </li>
))}

       
      </ul>
    </div>

  );
};



const RestaurantCard = (props)=>{
    const {resdata}= props;
   return (
    <><div className="res-Card" style={styleCard}>
      
      <img className="res-logo"
           alt="res-Card" 
      src={"https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/" + resdata.info.cloudinaryImageId}/>
      
    
      
      <h3>{resdata.info.name} </h3>
      <h4>{resdata.info.cuisines.join(" ,")}</h4>
      <h4>{resdata.info.deliveryTime}</h4>
      <h4>{resdata.info.avgRating}</h4>
    </div>
    </>
   )
  }





const Body = ()=>{

  const [searchText , setSearchText] = useState("");
  const [filteredRestaurant,setFilteredRestaurant] = useState([]);

const [listOfRestaurant,setListOfRestaurant]=useState([]);

useEffect(()=>{
  fetchData();
},[]);

const fetchData = async () => {
  const data = await fetch(
    "https://www.swiggy.com/dapi/restaurants/list/v5?lat=21.99740&lng=79.00110&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
  );
  const json = await data.json();

  // Log to confirm structure
  console.log("Fetched Swiggy data:", json);

  const restaurants = json.data.cards
    .find(card => card.card?.card?.gridElements?.infoWithStyle?.restaurants)
    ?.card?.card?.gridElements?.infoWithStyle?.restaurants;
    

  setTimeout(() => {
    setListOfRestaurant(restaurants || []);
    setFilteredRestaurant(restaurants || []);
  }, 2000);


};

const Shimmer = ()=>{
  return(
  <div className ="Shimmer-container">
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
    <div className = "Shimmer-card "> </div>
  </div>
);
};


if (!listOfRestaurant || listOfRestaurant.length === 0) {
  return <Shimmer />;
}




  return (
    <div className="body">
      <div className="search">
  <input type="text"
   placeholder="Search here"
   value={searchText}
   onChange={(e)=>setSearchText(e.target.value)}
   
   />
  <button onClick={() => { 
  const filtered = listOfRestaurant.filter((res) =>
    res.info.name.toLowerCase().includes(searchText.toLowerCase())
  );
  setFilteredRestaurant(filtered);
}}>
  Search
</button>
</div>


<div className="filter">
  <button className="filter-btn" onClick={()=>{const filteredList = listOfRestaurant.filter((res) => res.info.avgRating >4.2);
    
    setFilteredRestaurant(filteredList);;

  }}>Top Rated Restaurant</button>

</div>





<div className="res-Container">
 {filteredRestaurant && filteredRestaurant.map((res) => (
    <Link key={res.info.id} to = {"/restaurants/"+res.info.id}><RestaurantCard  resdata={res} /></Link>
  ))}
</div>


    </div>
  )

}
const Header = ()=>{

  const onlineStatus= useOnlineStatus();

if (onlineStatus===false)
  return(
<h1>
  Looks Like You Are Offline!!!! Please Check YOur Internet Connection
</h1>)





const [btnNameReact, setBtnNameReact] = useState("Login")


    return (
  <div className="header">
    <div className="logo-container">
      <img className="logo" src="data:image/jpeg;base64,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" />
    </div>
  
    <div className="nav-items">
      <ul>
        <li>Online Status:{onlineStatus ?"✅" : "🔴"}</li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About us</Link></li>
        <li><Link to="/contact">ContactUs</Link></li>
        <li>Cart</li>
        <button className="Login-btn" onClick={()=>{
          btnNameReact === "Login" ? setBtnNameReact("Logout"):setBtnNameReact("Login");
          }}>{btnNameReact}</button>
  
  
      </ul>

    </div>
  
  </div>
  
    );
  };


const styleCard={
  backgroundColor:"#f0f0f0",
};

const About = () =>{
  return(
    <div className="about-page">
      <h1>About Us</h1>
      <p>
        Welcome to our Food Ordering App! 🍔🍕
      </p>

      <p>
        This app is built using <strong>React.js</strong> and uses the Swiggy public API to display a wide range of restaurants. 
        You can search for your favorite restaurants, filter top-rated ones, and view detailed menus and information.
      </p>

      
        Features:
        <ul>
          <li>🔍 Search for restaurants by name</li>
          <li>⭐ Filter by top-rated restaurants</li>
          <li>🖼️ View restaurant images and cuisines</li>
          <li>⏱️ Know the delivery time and rating</li>
        </ul>
      

      <p>
        This project is a learning-based food ordering interface designed to practice React concepts such as components, state, props, hooks, and conditional rendering.
      </p>

      <p>
        Thank you for visiting our app! Happy ordering! 😋
      </p>
    </div>
  )
};

const ContactUs = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! If you have any questions, feedback, or just want to connect, feel free to reach out.</p>

      <div className="contact-info">
        <p>
          📧 Email: <a href="mailto:ashishmehta425@gmail.com">yourmail@gmail.com</a>
        </p>
        <p>
          💼 LinkedIn: <a href="https://www.linkedin.com/in/ashish-mehta-2a4839264/" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/yourlinkedinid
          </a>
        </p>
      </div>
    </div>
  );
};
const Error = ()=>{
  return(
    <div>Opps!!!
    <div>Something went wrong </div></div>
  )
}



const AppLayout = ()=> {
  return (
    <div className="app">
      <Header/>
      <Outlet/>
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children:[ 
      {
        path : "/",
        element:<Body/>,
      },
      {
    path: "/about",
    element: <About />,
  },

{
  path:"/contact",
  element: <ContactUs/>,
},
{
  path:"/restaurants/:resId",
  element:<RestaurantMenu/>
}

    ],
    errorElement:<Error/>,
  },
 ]);








const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);















































































































// till episode 3

// const heading = React.createElement("h1",
//    { id: "heading" },
//     "namaste react");



//     // agr sirf ek line ho to return likhne ki zarurat nhi h...direct jsx return kardena or agr multiple line ho to () ke andr dalna hoga .
//     const Headingcomponent = () =>{
//       return <h1>hi this is namaste react</h1>;
//      };


//     // jsx-
//     const jsxHeading = <h1>namste React using JSX</h1>

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(jsxHeading);











































// episode 1&2

/* 

<div id="parent">
  <div id=child>
    <h1>I'm h1 Tag</h1>
    <h2>I'm h2 Tag</h2>
  </div>
  <div id=child2>
    <h1>I'm h1 Tag</h1>
    <h2>I'm h2 Tag</h2>
  </div>
</div>

ReactElement(Object) => HTML(Browser Understands)

*/

// const parent = React.createElement('div', { id: 'parent' }, [
//   React.createElement('div', { id: 'child' }, [
//     React.createElement('h1', {}, 'This is Namaste React 🚀'),
//     React.createElement('h2', {}, "I'm h2 Tag"),
//   ]),
//   React.createElement('div', { id: 'child2' }, [
//     React.createElement('h1', {}, "I'm h1 Tag"),
//     React.createElement('h2', {}, "I'm h2 Tag"),
//   ]),
// ]);

// JSX

// console.log(parent);

// // const heading = React.createElement(
// //   'h1',
// //   { id: 'heading', className: 'head' },
// //   'Hello World from React!'
// // ); // It's the job of Core React to create an element i.e, heading in this case

// // React Element is normal JavaScript Object{}

// // console.log(heading); // object

// const root = ReactDOM.createRoot(document.getElementById('root')); // It's the job of ReactDOM to create root i.e, heading in this case, bcz root is a dom element which is rendered to be on browser. This root is the place where all React code will run.

// // root.render(heading);
// root.render(parent);

// In React, Render is the technique that can redirect a page with the help of function render(). Most importantly, render a function we can use to define the HTML code within the HTML element. It helps to display certain views in the UI using certain logic defined in the render function and returns the output.


