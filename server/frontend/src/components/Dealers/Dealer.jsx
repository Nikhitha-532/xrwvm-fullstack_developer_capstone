import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  // 1. 初始化状态，使用 null 和空数组初始化 `dealer` 和 `reviews`，提供明确的“未加载”状态。
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);

  const { id } = useParams();  // 使用 React Router 的 useParams 钩子来获取路由参数。
  const root_url = window.location.href.substring(0, window.location.href.indexOf("dealer"));
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;
  const post_review_url = `${root_url}postreview/${id}`;

  // 2. 异步获取经销商信息
  const get_dealer = async () => {
    try {
      const response = await fetch(dealer_url);
      const result = await response.json();
      // 3. 检查 response.ok 确保请求成功，然后更新状态
      if (response.ok && result.dealer) {
        setDealer(result.dealer);
      } else {
        console.error('Failed to load dealer data:', result);
        setDealer(null);
      }
    } catch (error) {
      console.error('Error fetching dealer:', error);
      setDealer(null);
    }
  };

  // 4. 异步获取评论信息
  const get_reviews = async () => {
    try {
      const response = await fetch(reviews_url);
      const result = await response.json();
      if (response.ok && result.reviews.length > 0) {
        setReviews(result.reviews);
        setUnreviewed(false);
      } else {
        setReviews([]);
        setUnreviewed(true);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setUnreviewed(true);
    }
  };

  // 5. 根据情绪返回相应图标的函数
  const senti_icon = (sentiment) => {
    return sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    // 6. 在 sessionStorage 中检查用户名，如果存在，则显示发表评论的链接
    if (sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review_url}><img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' /></a>);
    }
    // 7. 添加依赖项 [id] 确保 id 变化时重新触发 effect
  }, [id]);  

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        {/* 8. 条件渲染，确保数据加载完毕后再访问 dealer 属性 */}
        {dealer ? (
          <>
            <h1 style={{ color: "grey" }}>{dealer.full_name}{postReview}</h1>
            <h4 style={{ color: "grey" }}>{dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}</h4>
          </>
        ) : (
          <h1>Loading dealer information...</h1>
        )}
      </div>
      <div className="reviews_panel">
        {/* 9. 条件渲染评论，根据评论情况显示不同内容 */}
        {unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className='review_panel'>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment'/>
              <div className='review'>{review.review}</div>
              <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
