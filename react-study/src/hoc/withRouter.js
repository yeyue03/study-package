import { useLocation, useParams } from "react-router-dom"

const withRouter = (Compoent) => {
  const Wrapper = (props) => {
    const location = useLocation();
    const params = useParams();

    return (
      <Compoent
        location={location}
        params={params}
        {...props}
      />
    )
  }

  return Wrapper;
}

export default withRouter;