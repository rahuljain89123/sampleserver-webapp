
import $q from 'q'
import API from '../API'

import {
  RECEIVE_WELL_IMAGES,
  REMOVE_WELL_IMAGE,
} from '../constants/WellImageActionTypes'

export const receiveWellImages = (wellId, wellImages) => ({
  type: RECEIVE_WELL_IMAGES,
  wellId,
  wellImages,
})

export const removeWellImage = (wellId, wellImageId) => ({
  type: REMOVE_WELL_IMAGE,
  wellId,
  wellImageId,
})

export const fetchWellImages = (wellId) =>
  dispatch =>
    API.get(`/wellimages/?well_id=${wellId}`)
      .then(wellImages =>
        dispatch(receiveWellImages(wellId, wellImages))
      )

/**
 *
 * @param {integer} wellId
 * @param {Object[]} wellImages - array of well images
 * Uses $q library  to allow for multiple post requests
 */
export const uploadWellImages = (wellId, wellImages) =>
  dispatch => {
    const
      deferred = $q.defer(),
      promises = wellImages.map(function(wellImageParams) {
        const deferred2 = $q.defer();

        API.post('/wellimages/', wellImageParams)
          .then(json => {
            return deferred.resolve(json);
          }).catch(e => {
            return deferred.reject(e);
          })

        return deferred2.promise;
      });

    $q.all(promises)
      .then(function(results) {
        return deferred.resolve();
      })
      .fail(deferred.reject);

    return deferred.promise;
  }

export const deleteWellImage = (wellId, wellImageId) =>
  dispatch => API.delete(`/wellimages/${wellImageId}`).
    then(() =>
      dispatch(removeWellImage(wellId, wellImageId))
    )
