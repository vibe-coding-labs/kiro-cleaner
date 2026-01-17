import { Button, Card } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

/**
 * Simple test component to verify Ant Design setup
 */
const AntTest = () => {
  return (
    <Card 
      title="Ant Design Test" 
      style={{ maxWidth: 400, margin: '20px auto' }}
    >
      <p>If you can see this card with proper styling, Ant Design is working!</p>
      <Button type="primary" icon={<CheckCircleOutlined />}>
        Test Button
      </Button>
    </Card>
  );
};

export default AntTest;
