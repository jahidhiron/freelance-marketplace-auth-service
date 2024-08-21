import { Client } from '@elastic/elasticsearch';
import { config } from '@auth/config';
import { ISellerGig, winstonLogger } from '@jahidhiron/jobber-shared';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

export const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('AuthService connecting to ElasticSearch...');
    try {
      const health = await elasticSearchClient.cluster.health({});
      log.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'AuthService checkConnection() method:', error);
    }
  }
}

async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({ index: indexName });
  return result;
}

export async function createIndex(indexName: string): Promise<void> {
  try {
    const result = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      // after creating index and then call refresh, when
      // any document is added then it is available to search
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log('error', 'AuthService createIndex() method error:', error);
  }
}

export async function getDocumentById(index: string, gigId: string): Promise<ISellerGig> {
  try {
    const result = await elasticSearchClient.get({
      index,
      id: gigId
    });

    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', 'AuthService elastcisearch getDocumentById() method error:', error);
    return {} as ISellerGig;
  }
}
