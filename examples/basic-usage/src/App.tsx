import React from 'react';
import { useUniState, useUniRouter, useUniRequest } from '../../../src'; // Adjust path as needed

const App = () => {
  const [count, setCount] = useUniState(0);
  const { push } = useUniRouter();
  const { get } = useUniRequest();

  const increment = () => {
    setCount(count + 1);
  };

  const fetchData = async () => {
    try {
      const data = await get('/api/data');
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>UniAdapter 基础示例</h1>
      <div>
        <p>计数: {count}</p>
        <button onClick={increment} style={{ marginRight: '10px' }}>
          增加
        </button>
        <button 
          onClick={() => push('/about')} 
          style={{ marginRight: '10px' }}
        >
          跳转到关于页
        </button>
        <button onClick={fetchData}>
          获取数据
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>当前平台: {window.location.href}</h3>
        <p>这个示例展示了UniAdapter的跨平台适配能力</p>
      </div>
    </div>
  );
};

export default App;