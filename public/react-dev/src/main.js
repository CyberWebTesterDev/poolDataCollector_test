import { TEST_IMP } from './views/imp';

const TestComp = () => {
    return <h2>This text rendered by React {TEST_IMP}</h2>;
}

ReactDOM.render(
    <TestComp />,
    document.getElementById('root')
);