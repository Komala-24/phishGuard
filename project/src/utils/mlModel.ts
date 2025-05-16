import * as tf from '@tensorflow/tfjs';
import phishingDataset from '../data/phishing-dataset.json';

// Initialize and train the model
let model: tf.LayersModel | null = null;

export const initializeModel = async () => {
  // Create a sequential model
  model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [20], units: 64, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 32, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 4, activation: 'softmax' }) // 4 classes: safe, low, medium, high
    ]
  });

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  // Train the model with the dataset
  await trainModel();
};

const trainModel = async () => {
  if (!model) return;

  // Convert dataset to tensors
  const features = tf.tensor2d(phishingDataset.features);
  const labels = tf.tensor2d(phishingDataset.labels);

  // Train the model
  await model.fit(features, labels, {
    epochs: 50,
    batchSize: 32,
    validationSplit: 0.2,
    shuffle: true
  });
};

export const predictSeverity = async (features: number[]): Promise<{
  severity: 'safe' | 'low' | 'medium' | 'high';
  confidence: number;
}> => {
  if (!model) {
    await initializeModel();
  }

  const prediction = model!.predict(tf.tensor2d([features])) as tf.Tensor;
  const probabilities = await prediction.data();
  
  // Get the highest probability class
  const maxProbIndex = probabilities.indexOf(Math.max(...Array.from(probabilities)));
  const severityMap = ['safe', 'low', 'medium', 'high'];
  
  return {
    severity: severityMap[maxProbIndex] as 'safe' | 'low' | 'medium' | 'high',
    confidence: Math.round(probabilities[maxProbIndex] * 100)
  };
};