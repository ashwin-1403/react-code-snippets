import { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { Link, useNavigate } from "react-router-dom";
import SponserHeader from "../../Component/Header/SponserHeader";
import "./Sponsor.style.scss";
import NoData from "../../Utills/NoData/NoData";
import Loader from "../../Utills/Loader/Loader";
import useApiService from "../../Utills/ApiAxiosHandler/ApiAxiosHandler";

function Sponser() {
  const axiosInstance = useApiService();
  const [loading, setLoading] = useState(true);
  const [sponsor, setSponsor] = useState([]);
  const [search, setSearch] = useState("");
  const [sortedBy, setSortedBy] = useState("name");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  const getSposorsData = () => {
    setLoading(true);
    axiosInstance
      .get(`admin/sponsors`, {
        params: {
          currentPage: page,
          pageSize,
          search,
          sortBy: sortedBy,
        },
      })
      .then((response) => {
        setLoading(false);
        setSponsor(response.data.data);
        setTotal(response?.data?.totalSponsor);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getSposorsData();
    }, 700);

    return () => clearTimeout(delayDebounceFn);
  }, [search, sortedBy, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sortedBy]);

  return (
    <>
      <SponserHeader setSearch={setSearch} setSortedBy={setSortedBy} />
      {loading ? (
        <Loader startLoader={loading} />
      ) : (
        <div className="sponsor-container TopCommon ">
          <div className="container MainClass">
            <div className="row">
              {sponsor?.length > 0 ? (
                sponsor.map((item: any, index) => {
                  return (
                    <div className="col-md-4" key={index}>
                      <div
                        className="sponsor"
                        key={index}
                        onClick={() => navigate(`/SponserChild/${item._id}`)}
                      >
                        <div className="card-sponsor">
                          <img
                            src={item.image}
                            className="card-img-top"
                            alt="..."
                          />
                          <div className="card-body">
                            <Link to="/" className="card-text">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <NoData content="No sponsor created yet." />
              )}
              {total > pageSize && (
                <Pagination
                  activePage={page}
                  itemsCountPerPage={pageSize}
                  totalItemsCount={total}
                  onChange={(page) => setPage(page)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sponser;
