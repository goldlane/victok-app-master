import { Input } from 'antd';

function ChartInput({ name, value, onChange, style, maxLength }) {
  return <Input name={name} value={value} onChange={onChange} style={style} maxLength={maxLength} />;
}

export default ChartInput;
