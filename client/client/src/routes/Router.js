import { Route} from 'react-router-dom';
import  Home  from '../components/pages/Home/Home';
import  About from '../components/pages/About/About';
import  News  from '../components/pages/News/News';
import  Projects  from '../components/pages/Projects/Projects';
import Crops from '../components/pages/Crops/Crops';
import  Contact  from '../components/pages/Contact/Contact';
import SingleProduct from '../components/SingleProduct/SingleProduct';
import Addproducts from '../components/AddProducts/AddProducts';
import Lands from '../components/Lands/Lands';
import Stock from '../components/Stock/Stock';
import Register from '../components/Register/Register';

export function Routes() {
    return (
      <>
        <Route path = "/Home" exact  component={Home} />
        <Route path = "/" exact  component={Home} />
        <Route path = "/About" exact  component={About} />
        <Route path = "/News" exact component={News} />
        <Route path = "/Projects" exact  component={Projects} />
        <Route path = "/Crops" exact  component={Crops} />
        <Route path = "/Lands" exact  component={Lands} />
        <Route path = "/Stock" exact  component={Stock} />
        <Route path = "/Contact" exact  component={Contact} />
        <Route path = "/singleProduct/:id" exact  component={SingleProduct} />
        <Route path = "/addProducts" exact  component={Addproducts} />
        <Route path = "/Register" exact  component={Register} />
      </>
    );
  }