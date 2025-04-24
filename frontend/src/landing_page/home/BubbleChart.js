import React from "react";
import * as d3 from "d3";

// Data with explanations
const sdg17Data = [
  {
    name: "Finance",
    value: 8212,
    explanation:
      "Mobilizing financial resources to support sustainable development in developing countries.",
  },
  {
    name: "Technology",
    value: 5312,
    explanation:
      "Promoting the development, transfer, and diffusion of environmentally sound technologies.",
  },
  {
    name: "Capacity Building",
    value: 4212,
    explanation:
      "Enhancing international support for effective and targeted capacity-building in developing nations.",
  },
  {
    name: "Trade",
    value: 3912,
    explanation:
      "Promoting equitable trade systems, increasing exports of developing countries.",
  },
  {
    name: "Systemic Issues",
    value: 3012,
    explanation:
      "Includes policy and institutional coherence, multi-stakeholder involvement, etc.",
  },
  {
    name: "North-South Cooperation",
    value: 2512,
    explanation:
      "Enhancing cooperation between developed (North) and developing (South) countries.",
  },
  {
    name: "Multi-stakeholder Partnerships",
    value: 2312,
    explanation:
      "Partnerships involving governments, civil society, private sector, and others.",
  },
  {
    name: "Public-Private Partnerships",
    value: 2100,
    explanation:
      "Collaborations between public institutions and private entities to achieve SDGs.",
  },
  {
    name: "Data & Monitoring",
    value: 1850,
    explanation:
      "High-quality, timely, and reliable data collection to measure progress.",
  },
  {
    name: "Policy Coherence",
    value: 1450,
    explanation:
      "Ensuring policies across sectors support sustainable development and do not contradict each other.",
  },
  {
    name: "Official Development Assistance (ODA)",
    value: 900,
    explanation:
      "International aid from developed to developing countries for sustainable development.",
  },
  {
    name: "Debt Sustainability",
    value: 750,
    explanation:
      "Ensuring that developing countries can manage and service their debt sustainably.",
  },
];

const bootstrapColors = [
  "bg-primary",
  "bg-success",
  "bg-warning",
  "bg-danger",
  "bg-info",
  "bg-secondary",
  "bg-dark",
  "bg-primary-subtle",
  "bg-success-subtle",
  "bg-warning-subtle",
  "bg-danger-subtle",
  "bg-info-subtle",
];

export const BubbleChart = () => {
  const color = d3.scaleOrdinal(bootstrapColors);
  const pack = d3.pack().size([1000, 1000]).padding(12);
  const strokeSize = 1;

  const root = pack(
    d3.hierarchy({ children: sdg17Data }).sum((d) => d.value)
  );

  const nodes = root.leaves().map((d, i) => ({
    x: d.x,
    y: d.y,
    r: d.r,
    fill: color(i),
    name: d.data.name,
    value: d.data.value,
  }));

  return (
    <div className="container my-4">
      {/* Bubble Chart */}
      <h2>The Power of Partnerships in Advancing SDGs</h2>
      <div
        className="position-relative mx-auto"
        style={{
          width: "100%",
          aspectRatio: "1",
          maxWidth: "28rem",
        }}
      >
        {nodes.map((node, i) => (
          <div
            key={i}
            className={`position-absolute d-flex flex-column align-items-center justify-content-center text-white text-center overflow-hidden ${node.fill}`}
            style={{
              left: `${(node.x / 1000) * 100}%`,
              top: `${(node.y / 1000) * 100}%`,
              width: `${((node.r * 2) / 1000) * 100}%`,
              height: `${((node.r * 2) / 1000) * 100}%`,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `${strokeSize}px solid #ffffff33`,
              padding: "0.25rem",
            }}
            title={`${node.name}\n${d3.format(",d")(node.value)}`}
          >
            <div
              className="fw-bold text-nowrap text-truncate"
              style={{
                fontSize: `${node.r / 7.5}px`,
                maxWidth: "90%",
                lineHeight: 1.1,
              }}
            >
              {node.name}
            </div>
            <div
              className="opacity-75 text-nowrap"
              style={{
                fontSize: `${node.r / 9.5}px`,
                maxWidth: "90%",
                lineHeight: 1.1,
              }}
            >
              {d3.format(",d")(node.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Details Table */}
      <h4 className="mt-5 mb-3 text-center">SDG 17 Detailed Breakdown</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
              <th scope="col">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {sdg17Data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{d3.format(",d")(item.value)}</td>
                <td>{item.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
