import './Home.css';
import Navigation from '../Navigation';
import Featured from './Featured';

export default function Home()
{
    return (<>
        <Navigation />
        <div className='banner'>
            <h1>Bookstore</h1>
        </div>
        <hr className='banner-underline'/>
        <div className='user-home'>    
            <div className='featured-section'>
                <h1>Featured</h1>
                <hr></hr>
                <div>
                    <Featured cat='FEATURED'/>
                </div>
            </div>
            <div className='featured-section'>
                <h1>Top Sellers</h1>
                <hr></hr>
                <div>
                    <Featured cat='TOP_SELLER'/>
                </div>  
            </div>
        </div>
    </>);
}   
