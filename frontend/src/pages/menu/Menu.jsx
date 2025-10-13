import './Menu.css'
import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { biriyani, burger, one, pizza } from '../../assets/assets'
import { getAllItems, getItemsByCategory, getTrendingItems, searchItems } from '../../services/api';

function Menu() {
  // State for managing data
  const [menuData, setMenuData] = useState({
    'sri-lankan': [],
    'indian': [],
    'chinese': [],
    'family-meals': [],
    'desserts': [],
    'bakery': [],
    'pizza': [],
    'beverages': []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Category configuration with images
  const categories = [
    { 
      key: 'sri-lankan', 
      title: 'Sri Lankan Food', 
      image: one,
      displayTitle: 'Sri Lankan Food'
    },
    { 
      key: 'indian', 
      title: 'Indian Food', 
      image: biriyani,
      displayTitle: 'Indian Food'
    },
    { 
      key: 'chinese', 
      title: 'Chinese Food', 
      image: one,
      displayTitle: 'Chinese Food'
    },
    { 
      key: 'family-meals', 
      title: 'Family Meals', 
      image: one,
      displayTitle: 'Family Meals'
    },
    { 
      key: 'desserts', 
      title: 'Desserts', 
      image: one,
      displayTitle: 'Desserts'
    },
    { 
      key: 'bakery', 
      title: 'Bakery Items', 
      image: one,
      displayTitle: 'Bakery Items'
    },
    { 
      key: 'pizza', 
      title: 'Pizza', 
      image: pizza,
      displayTitle: 'Pizza'
    },
    { 
      key: 'beverages', 
      title: 'Beverages', 
      image: burger,
      displayTitle: 'Beverages'
    }
  ];

  // Load data for all categories
  useEffect(() => {
    const loadAllCategoryData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const newMenuData = {};
        
        // Load items for each category
        for (const category of categories) {
          try {
            const response = await getItemsByCategory(category.key);
            newMenuData[category.key] = response.data.items || [];
            console.log(`Loaded ${response.data.items?.length || 0} items for ${category.key}`);
          } catch (categoryError) {
            console.error(`Error loading ${category.key}:`, categoryError);
            newMenuData[category.key] = [];
          }
        }
        
        setMenuData(newMenuData);
      } catch (error) {
        console.error('Error loading menu data:', error);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAllCategoryData();
  }, []);

  // Function to render menu items for a category
  const renderMenuItems = (categoryItems) => {
    if (!categoryItems || categoryItems.length === 0) {
      return (
        <div className="no-items-message">
          <p>No items available in this category yet.</p>
        </div>
      );
    }

    return categoryItems.map((item) => (
      <div key={item.id} className="menu-item">
        <img 
          className='menu-top-item-image' 
          src={item.itemImage || one} 
          alt={item.itemName}
          onError={(e) => {
            e.target.src = one; // Fallback to default image
          }}
        />
        {item.isTrending && <span className="trending-badge">🔥 Trending</span>}
        <h3 className='menu-top-item-title'>{item.itemName}</h3>
        <h3 className='price'>Rs. {item.itemPrice.toFixed(2)}</h3>
        <p className='item-portion'>ID: {item.foodID}</p>
        <p className='item-description'>{item.itemDescription}</p>
        <button className='add-to-cart-btn'>Add to Cart</button>
      </div>
    ));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='menu-page'>
          <div className="loading-container">
            <h2>Loading delicious menu items...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className='menu-page'>
          <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <div className='menu-page'>
        <h1 className='menu-page-title'>MENU CARD</h1>
        <h3 className='menu-page-subtitle'>Explore our delicious menu</h3>

        {/* Category Grid - Top Navigation */}
        <div className="menu-grid">
          {categories.map((category) => (
            <div key={category.key} className="menu-item">
              <img className='menu-top-item-image' src={category.image} alt={category.title} />
              <h3 className='menu-top-item-title'>{category.title}</h3>
              <span className="item-count">
                {menuData[category.key]?.length || 0} items
              </span>
            </div>
          ))}
        </div>

        {/* Menu Container - All Categories with Items */}
        <div className="menu-container">
          {categories.map((category) => (
            <div key={category.key} className="sub-menu">
              <div className="line-about-menu">
                <div className="line line-menu"></div>
                <h2 className='sub-menu-title'>{category.displayTitle}</h2>
                <div className="line line-menu"></div>
              </div>

              <div className="sub-menu-container">
                {renderMenuItems(menuData[category.key])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Menu