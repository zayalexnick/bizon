export function countPageAction() {
    return {
        type: 'COUNT_PAGE',
    };
}

export function closeBannerAction() {
    return {
        type: 'CLOSE_BANNER',
    };
}

export function openNewsOneAction() {
    return {
        type: 'OPEN_NEWS_ONE',
    };
}

export function newsOneToFalseAction() {
    return {
        type: 'NEWS_ONE_TO_FALSE',
    }
}

export function bannerToStoreAction(data) {
  return {
    type: 'BANNER_TO_STORE',
    data,
  }
}

export function defaultAutoAction(data) {
    return {
        type: 'DEFAULT_AUTO',
        data,
    }

}

export function setActionZapisToTrueAction() {
    return {
        type: 'ACTION_ZAPIS',
    }

}

export function setActionZapisToFalseAction() {
    return {
        type: 'ACTION_ZAPIS_FALSE',
    }

}
