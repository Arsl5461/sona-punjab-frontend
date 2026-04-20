import React, { useEffect, useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import { ScaleLoader } from "react-spinners";
import { Button, Table } from "react-bootstrap";
import { FaPen, FaTrash } from "react-icons/fa6";
import { getAllMarquees, normalizeMarqueeList } from "./__request/MarqueeRequest";
import CreateMarqueeModal from "./CreateMarqueeModal";
import EditMarqueeModal from "./EditMarqueeModal";
import DeleteMarqueeModal from "./DeleteMarqueeModal";

const AllMarqueeList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllMarquees();
      setRows(normalizeMarqueeList(res));
    } catch (err) {
      console.error(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <MasterLayout>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h5 className="card-title mb-0">Headlines</h5>
              </div>
              <Button variant="primary" onClick={() => setShowCreate(true)}>
                Add headline
              </Button>
            </div>
            <div className="card-body">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "200px" }}
                >
                  <ScaleLoader color="#0d6efd" />
                </div>
              ) : rows.length === 0 ? (
                <div
                  className="d-flex flex-column align-items-center justify-content-center text-muted py-5"
                >
                  <p className="mb-2">No headlines yet.</p>
                  <p className="small mb-0 text-center px-2">
                    After you add headlines here, the home and club pages will
                    show them instead of the default welcome text (when the API
                    is wired on the server).
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "3rem" }}>#</th>
                        <th>Headline</th>
                        <th style={{ width: "8rem" }} className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row._id || index}>
                          <td>{index + 1}</td>
                          <td className="text-break small">{row.text}</td>
                          <td className="text-end text-nowrap">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => {
                                setSelected(row);
                                setShowEdit(true);
                              }}
                              title="Edit"
                            >
                              <FaPen />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setSelected(row);
                                setShowDelete(true);
                              }}
                              title="Delete"
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </MasterLayout>

      <CreateMarqueeModal
        show={showCreate}
        handleClose={() => setShowCreate(false)}
        getMarquees={load}
      />
      <EditMarqueeModal
        show={showEdit}
        handleClose={() => {
          setShowEdit(false);
          setSelected(null);
        }}
        row={selected}
        getMarquees={load}
      />
      <DeleteMarqueeModal
        show={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setSelected(null);
        }}
        row={selected}
        getMarquees={load}
      />
    </>
  );
};

export default AllMarqueeList;
