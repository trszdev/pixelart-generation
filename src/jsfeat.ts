import { GetMaxEigen } from './types'


declare const jsfeat

const getMaxEigenWrapper: GetMaxEigen = (vec9: number[]) => {
  const lambdas = new jsfeat.matrix_t(3, 1, jsfeat.F32_t | jsfeat.C1_t)
  const vectors = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t)
  const m = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t)
  m.data = new Float32Array(vec9)
  jsfeat.linalg.eigenVV(m, vectors, lambdas)
  const [x, y, z] = vectors.data
  return { lambda: lambdas.data[0], vec: [x, y, z] }
}

export default getMaxEigenWrapper
