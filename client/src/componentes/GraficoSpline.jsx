import React from 'react';
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Export,
  Legend,
  Margin,
  Tooltip,
  SeriesTemplate,
} from 'devextreme-react/chart';
import PropTypes from 'prop-types';

const GraficoSpline = (props) => {
  const {
    data, dataFormat, titulo, rangoVisual,
  } = props;
  return (
    <>
      <Chart
        palette="Violet"
        dataSource={data}
        title={titulo}
      >
        <CommonSeriesSettings
          argumentField="fecha"
          type="spline"
        />
        <CommonAxisSettings>
          <Grid visible />
        </CommonAxisSettings>

        {dataFormat[0] && dataFormat[0].filter
          && (
            <SeriesTemplate
              nameField={dataFormat[0].filter}
              customizeSeries={(seriesName) => (seriesName === true ? { name: dataFormat[0].filterTrue, valueField: 'valor' } : { name: dataFormat[0].filterFalse, valueField: 'valor' })}
            />
          )}
        { dataFormat[0] && !dataFormat[0].filter
          && dataFormat.map((serie) => (
            <Series
              valueField={serie.value}
              key={serie.name}
              name={serie.name}
              showInLegend={dataFormat.length > 1}
            />
          ))}

        <Margin bottom={20} />
        <ValueAxis
          visualRange={rangoVisual}
        />
        <ArgumentAxis
          allowDecimals={false}
          axisDivisionFactor={60}
        />
        <Legend
          verticalAlignment="top"
          horizontalAlignment="right"
        />
        <Export enabled />
        <Tooltip enabled />
      </Chart>
    </>
  );
};

GraficoSpline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      valor: PropTypes.number,
      fecha: PropTypes.string,
    }),
  ).isRequired,
  dataFormat: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
      filter: PropTypes.string,
      filterTrue: PropTypes.string,
      filterFalse: PropTypes.string,
    }),
  ).isRequired,
  titulo: PropTypes.string.isRequired,
  rangoVisual: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default GraficoSpline;
