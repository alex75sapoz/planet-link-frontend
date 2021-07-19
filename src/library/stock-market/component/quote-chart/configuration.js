import { timeframeEnum } from '../../stock-market-enum';

export const timeframeChartConfig = {
    [timeframeEnum.oneDay]: {
        1: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY hh A',
                label: 'hh A',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'hh:mm A'
            }
        },
        2: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD',
                isFirstTickShown: true
            },
            tooltip: {
                label: 'MM/DD/YYYY hh:mm A'
            }
        },
        3: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD',
                isFirstTickShown: true
            },
            tooltip: {
                label: 'MM/DD/YYYY hh:mm A'
            }
        },
        default: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD/YYYY',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD/YYYY hh:mm A'
            }
        }
    },
    [timeframeEnum.fiveDay]: {
        1: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        },
        2: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        },
        3: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        },
        default: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD'
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        }
    },
    [timeframeEnum.oneMonth]: {
        1: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        },
        2: {
            xAxis: {
                showTickEvery: 'MM/YYYY',
                label: 'MM/DD',
                isFirstTickShown: true
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        },
        3: {
            xAxis: {
                showTickEvery: 'MM/YYYY',
                label: 'MM/DD',
                isFirstTickShown: true
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        },
        default: {
            xAxis: {
                showTickEvery: 'MM/DD/YYYY',
                label: 'MM/DD',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD hh:mm A'
            }
        }
    },
    [timeframeEnum.oneYear]: {
        1: {
            xAxis: {
                showTickEvery: 'MM/YYYY',
                label: 'MM/YYYY',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        },
        2: {
            xAxis: {
                showTickEvery: 'YYYY',
                label: 'MM/YYYY',
                isFirstTickShown: true
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        },
        3: {
            xAxis: {
                showTickEvery: 'YYYY',
                label: 'MM/YYYY',
                isFirstTickShown: true
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        },
        default: {
            xAxis: {
                showTickEvery: 'YYYY',
                label: 'MM/YYYY',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        }
    },
    [timeframeEnum.fiveYear]: {
        1: {
            xAxis: {
                showTickEvery: 'YYYY',
                label: 'YYYY',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        },
        2: {
            xAxis: {
                showTickEvery: 'YYYY',
                label: 'YYYY',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        },
        3: {
            xAxis: {
                showTickEvery: 'YYYY',
                label: 'YYYY',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        },
        default: {
            xAxis: {
                showTickEvery: 'YYYY',
                label: 'YYYY',
                isFirstTickShown: false
            },
            tooltip: {
                label: 'MM/DD/YYYY'
            }
        }
    }
}