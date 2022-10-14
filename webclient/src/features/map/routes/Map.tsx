import { Box } from '@chakra-ui/react';
import { FC, useCallback } from 'react';
import { ContentLayout } from '../../../components/Layout';
import { GeoloniaMap } from '@geolonia/embed-react';
import GeoJSON from 'geojson';
import { useGetDataset } from '../../../hooks/useDataset';
import { useParams } from 'react-router-dom';

export const Map: FC = () => {
  const { dataset_uid } = useParams<{ dataset_uid: string }>();
  const dataset = useGetDataset({ datasetUid: dataset_uid || '' });
  console.log(dataset);

  const telLink = (tel: string) => {
    return `<a href="tel:${tel}">${tel}</a>`;
  }

  const description = (point: any) => {
    return `<div>
      <strong>${point.名称}(${point.名称_カナ})</strong>
      <ul>
        <li>住所: ${point.住所}</li>
        <li>電話番号: ${telLink(point.電話番号)}</li>
      </ul>
    </div>`;
  }

  const points = dataset.map(point => {
    return {
      title: point.名称,
      description: description(point),
      lat: Number(point.緯度),
      lng: Number(point.経度),
    }
  });

  console.log(points)

  const onLoad = useCallback((map: any) => {
    map.on('load', () => {
      const geojson = (GeoJSON as any).parse(points, {
        Point: ['lat', 'lng'],
      });
      const simpleStyle = new (window as any).geolonia.simpleStyle(geojson);
      simpleStyle.addTo(map).fitBounds();
    });
  }, []);

  return (
    <ContentLayout title="マップ">
      <Box></Box>
      <GeoloniaMap
        style={{ height: '500px', width: '100%' }}
        className="geolonia"
        lat="35.681236"
        lng="139.767125"
        zoom="16"
        markerColor="#555"
        marker="off"
        onLoad={onLoad}
      />
    </ContentLayout>
  );
};
