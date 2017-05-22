
const Spinner = (props) => {
  if (!props.show) { return null }
  return (<span class='spinner'>Loading...</span>)
}

export default Spinner
