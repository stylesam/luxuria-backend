import { Subscription } from 'rxjs'
import { isEmpty } from './data'

export function isLiveSubscription(subscription: Subscription) {
  return !isEmpty(subscription) && !subscription.closed
}

export function unsubscribe(subscription: Subscription) {
  if (isLiveSubscription(subscription)) {
    subscription.unsubscribe()
  }
}
