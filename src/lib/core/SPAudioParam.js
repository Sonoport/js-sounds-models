/*
 ** @module Core
 */
define(
    [ 'core/WebAudioDispatch' ],
    function ( webAudioDispatch ) {
        "use strict";
        /**
         * Mock AudioParam used to create Parameters for Sonoport Sound Models. The SPAudioParam supports either a AudioParam backed parameter, or a completely Javascript mocked up Parameter, which supports a rough version of parameter automation.
         *
         *
         * @class SPAudioParam
         * @constructor
         * @param {String} [name] The name of the parameter.
         * @param {Number} [minValue] The minimum value of the parameter.
         * @param {Number} [maxValue] The maximum value of the parameter.
         * @param {Number} [defaultValue] The default and starting value of the parameter.
         * @param {AudioParam/Array} [aParams] A WebAudio parameter which will be set/get when this parameter is changed.
         * @param {Function} [mappingFunction] A mapping function to map values between the mapped SPAudioParam and the underlying WebAudio AudioParam.
         * @param {Function} [setter] A setter function which can be used to set the underlying audioParam. If this function is undefined, then the parameter is set directly.
         * @param {AudioContext} [audioContext] A WebAudio AudioContext for timing.
         */
        function SPAudioParam( name, minValue, maxValue, defaultValue, aParams, mappingFunction, setter, audioContext ) {
            // Min diff between set and actual
            // values to stop updates.
            var MIN_DIFF = 0.0001;
            var UPDATE_INTERVAL_MS = 500;
            var intervalID_;

            var value_ = 0;

            /**
             * @property defaultValue
             * @type Number/Boolean
             * @default 0
             */
            this.defaultValue = null;

            /**
             * @property maxValue
             * @type Number/Boolean
             * @default 0
             */
            this.maxValue = 0;

            /**
             * @property minValue
             * @type Number/Boolean
             * @default 0
             */

            this.minValue = 0;
            /**
             * @property name
             * @type String
             * @default ""
             */

            this.name = "";

            /**
             * @property value
             * @type Number/Boolean
             * @default 0
             */
            Object.defineProperty( this, 'value', {
                enumerable: true,
                set: function ( value ) {
                    // Sanitize the value with min/max
                    // bounds first.
                    if ( typeof value !== typeof defaultValue ) {
                        throw {
                            name: "Incorrect value type Exception",
                            message: "Attempt to set a " + ( typeof defaultValue ) + " parameter to a " + ( typeof value ) + " value",
                            toString: function () {
                                return this.name + ": " + this.message;
                            }
                        };
                    }
                    // Sanitize the value with min/max
                    // bounds first.
                    if ( typeof value === "number" ) {
                        if ( value > maxValue ) {
                            console.log( this.name + ' clamping to max' );
                            value = maxValue;
                        } else if ( value < minValue ) {
                            console.log( this.name + ' clamping to min' );
                            value = minValue;
                        }
                    }

                    // Map the value first
                    if ( typeof mappingFunction === 'function' ) {
                        // Map if mappingFunction is defined
                        value = mappingFunction( value );
                    }

                    // If setter exists, use that
                    if ( typeof setter === 'function' && audioContext ) {
                        setter( aParams, value, audioContext );
                    } else if ( aParams ) {
                        // else if param is defined, set directly
                        if ( aParams instanceof AudioParam ) {
                            aParams.value = value;
                        } else if ( aParams instanceof Array ) {
                            aParams.forEach( function ( thisParam ) {
                                thisParam.value = value;
                            } );
                        }
                    } else {
                        // Else if Psuedo param
                        window.clearInterval( intervalID_ );
                    }

                    // Set the value_ anyway.
                    value_ = value;
                },
                get: function () {
                    if ( aParams ) {
                        if ( aParams instanceof AudioParam ) {
                            return aParams.value;
                        } else if ( aParams instanceof Array ) {
                            // use a nominal Parameter to populate
                            return aParams[ 0 ].value;
                        }
                    }
                    return value_;
                }
            } );
            if ( aParams && ( aParams instanceof AudioParam || aParams instanceof Array ) ) {
                // Use a nominal Parameter to populate the values.
                var aParam = aParams[ 0 ] || aParams;
                this.defaultValue = aParam.defaultValue;
                this.minValue = aParam.minValue;
                this.maxValue = aParam.maxValue;
                this.value = aParam.defaultValue;
                this.name = aParam.name;
            }

            if ( name ) {
                this.name = name;
            }

            if ( typeof defaultValue !== 'undefined' ) {
                this.defaultValue = defaultValue;
                this.value = defaultValue;
            }

            if ( typeof minValue !== 'undefined' ) {
                this.minValue = minValue;
            }

            if ( typeof maxValue !== 'undefined' ) {
                this.maxValue = maxValue;
            }

            /**
             * Schedules a parameter value change at the given time.
             *
             * @method setValueAtTime
             * @param {Number} value The value parameter is the value the parameter will change to at the given time.
             * @param {Number} startTime The startTime parameter is the time in the same time coordinate system as AudioContext.currentTime.
             */
            this.setValueAtTime = function ( value, startTime ) {
                //console.log( "setting value " + value + " at time " + startTime + " for " + aParams );

                if ( typeof mappingFunction === 'function' ) {
                    value = mappingFunction( value );
                }
                if ( aParams ) {
                    if ( aParams instanceof AudioParam ) {
                        aParams.setValueAtTime( value, startTime );
                    } else if ( aParams instanceof Array ) {
                        aParams.forEach( function ( thisParam ) {
                            thisParam.setValueAtTime( value, startTime );
                        } );
                    }
                } else {
                    // Horrible hack for the case we don't have access to
                    // a real AudioParam.
                    var self = this;
                    webAudioDispatch( function () {
                        self.value = value;
                    }, startTime, audioContext );
                }
            };

            /**
             * Start exponentially approaching the target value at the given time with a rate having the given time constant.
             *
             * During the time interval: T0 <= t < T1, where T0 is the startTime parameter and T1 represents the time of the event following this event (or infinity if there are no following events):
             *     v(t) = V1 + (V0 - V1) * exp(-(t - T0) / timeConstant)
             *
             * @method setTargetAtTime
             * @param {Number} target The target parameter is the value the parameter will start changing to at the given time.
             * @param {Number} startTime The startTime parameter is the time in the same time coordinate system as AudioContext.currentTime.
             * @param {Number} timeConstant The timeConstant parameter is the time-constant value of first-order filter (exponential) approach to the target value. The larger this value is, the slower the transition will be.
             */
            this.setTargetAtTime = function ( target, startTime, timeConstant ) {
                if ( typeof mappingFunction === 'function' ) {
                    target = mappingFunction( target );
                }
                if ( aParams ) {
                    if ( aParams instanceof AudioParam ) {
                        aParams.setTargetAtTime( target, startTime, timeConstant );
                    } else if ( aParams instanceof Array ) {
                        aParams.forEach( function ( thisParam ) {
                            thisParam.setTargetAtTime( target, startTime, timeConstant );
                        } );
                    }
                } else {
                    // Horrible hack for the case we don't have access to
                    // a real AudioParam.
                    var self = this;
                    var initValue_ = self.value;
                    var initTime_ = audioContext.currentTime;
                    intervalID_ = window.setInterval( function () {
                        if ( audioContext.currentTime >= startTime ) {
                            self.value = target + ( initValue_ - target ) * Math.exp( -( audioContext.currentTime - initTime_ ) / timeConstant );
                            if ( Math.abs( self.value - target ) < MIN_DIFF ) {
                                window.clearInterval( intervalID_ );
                            }
                        }
                    }, UPDATE_INTERVAL_MS );
                }
            };
            /**
             * Sets an array of arbitrary parameter values starting at the given time for the given duration. The number of values will be scaled to fit into the desired duration.

             * During the time interval: startTime <= t < startTime + duration, values will be calculated:
             *
             *   v(t) = values[N * (t - startTime) / duration], where N is the length of the values array.
             *
             * @method setValueCurveAtTime
             * @param {Float32Array} values The values parameter is a Float32Array representing a parameter value curve. These values will apply starting at the given time and lasting for the given duration.
             * @param {Number} startTime The startTime parameter is the time in the same time coordinate system as AudioContext.currentTime.
             * @param {Number} duration The duration parameter is the amount of time in seconds (after the startTime parameter) where values will be calculated according to the values parameter.
             */
            this.setValueCurveAtTime = function ( values, startTime, duration ) {
                if ( typeof mappingFunction === 'function' ) {
                    for ( var index = 0; index < values.length; index++ ) {
                        values[ index ] = mappingFunction( values[ index ] );
                    }
                }
                if ( aParams ) {
                    if ( aParams instanceof AudioParam ) {
                        aParams.setValueCurveAtTime( values, startTime, duration );
                    } else if ( aParams instanceof Array ) {
                        aParams.forEach( function ( thisParam ) {
                            thisParam.setValueCurveAtTime( values, startTime, duration );
                        } );
                    }
                } else {
                    var self = this;
                    var initTime_ = audioContext.currentTime;
                    intervalID_ = window.setInterval( function () {
                        if ( audioContext.currentTime >= startTime ) {
                            var index = Math.floor( values.length * ( audioContext.currentTime - initTime_ ) / duration );
                            if ( index < values.length ) {
                                self.value = values[ index ];
                            } else {
                                window.clearInterval( intervalID_ );
                            }
                        }
                    }, UPDATE_INTERVAL_MS );
                }
            };

            /**
             * Schedules an exponential continuous change in parameter value from the previous scheduled parameter value to the given value.
             *
             * v(t) = V0 * (V1 / V0) ^ ((t - T0) / (T1 - T0))
             *
             * @method exponentialRampToValueAtTime
             * @param {Number} value The value parameter is the value the parameter will exponentially ramp to at the given time.
             * @param {Number} endTime The endTime parameter is the time in the same time coordinate system as AudioContext.currentTime.
             */
            this.exponentialRampToValueAtTime = function ( value, endTime ) {
                if ( typeof mappingFunction === 'function' ) {
                    value = mappingFunction( value );
                }
                if ( aParams ) {
                    if ( aParams instanceof AudioParam ) {
                        aParams.exponentialRampToValueAtTime( value, endTime );
                    } else if ( aParams instanceof Array ) {
                        aParams.forEach( function ( thisParam ) {
                            thisParam.exponentialRampToValueAtTime( value, endTime );
                        } );
                    }
                } else {
                    var self = this;
                    var initValue_ = self.value;
                    var initTime_ = audioContext.currentTime;
                    if ( initValue_ === 0 ) {
                        initValue_ = 0.001;
                    }
                    intervalID_ = window.setInterval( function () {
                        var timeRatio = ( audioContext.currentTime - initTime_ ) / ( endTime - initTime_ );
                        self.value = initValue_ * Math.pow( value / initValue_, timeRatio );
                        if ( audioContext.currentTime >= endTime ) {
                            window.clearInterval( intervalID_ );
                        }
                    }, UPDATE_INTERVAL_MS );
                }
            };

            /**
             *Schedules a linear continuous change in parameter value from the previous scheduled parameter value to the given value.
             *
             * @method linearRampToValueAtTime
             * @param {Float32Array} value The value parameter is the value the parameter will exponentially ramp to at the given time.
             * @param {Number} endTime The endTime parameter is the time in the same time coordinate system as AudioContext.currentTime.
             */
            this.linearRampToValueAtTime = function ( value, endTime ) {
                if ( typeof mappingFunction === 'function' ) {
                    value = mappingFunction( value );
                }
                if ( aParams ) {
                    if ( aParams instanceof AudioParam ) {
                        aParams.linearRampToValueAtTime( value, endTime );
                    } else if ( aParams instanceof Array ) {
                        aParams.forEach( function ( thisParam ) {
                            thisParam.linearRampToValueAtTime( value, endTime );
                        } );
                    }
                } else {
                    var self = this;
                    var initValue_ = self.value;
                    var initTime_ = audioContext.currentTime;
                    intervalID_ = window.setInterval( function () {
                        var timeRatio = ( audioContext.currentTime - initTime_ ) / ( endTime - initTime_ );
                        self.value = initValue_ + ( ( value - initValue_ ) * timeRatio );
                        if ( audioContext.currentTime >= endTime ) {
                            window.clearInterval( intervalID_ );
                        }
                    }, UPDATE_INTERVAL_MS );
                }
            };

            /**
             * Schedules a linear continuous change in parameter value from the previous scheduled parameter value to the given value.
             *
             * @method cancelScheduledValues
             * @param {Number} startTime The startTime parameter is the starting time at and after which any previously scheduled parameter changes will be cancelled.
             */
            this.cancelScheduledValues = function ( startTime ) {
                if ( aParams ) {
                    if ( aParams instanceof AudioParam ) {
                        aParams.cancelScheduledValues( startTime );
                    } else if ( aParams instanceof Array ) {
                        aParams.forEach( function ( thisParam ) {
                            thisParam.cancelScheduledValues( startTime );
                        } );
                    }
                } else {
                    window.clearInterval( intervalID_ );
                }
            };
        }

        /**
         * Static helper method to create Psuedo parameters which are not connected to
        any WebAudio AudioParams.
         *
         * @method createPsuedoParam
         * @static
         * @return  SPAudioParam
         * @param {String} name The name of the parameter..
         * @param {Number} minValue The minimum value of the parameter.
         * @param {Number} maxValue The maximum value of the parameter.
         * @param {Number} defaultValue The default and starting value of the parameter.
         * @param {AudioContext} audioContext An audiocontext in which this model exists.
         */
        SPAudioParam.createPsuedoParam = function ( name, minValue, maxValue, defaultValue, audioContext ) {
            return new SPAudioParam( name, minValue, maxValue, defaultValue, null, null, null, audioContext );
        };

        return SPAudioParam;
    } );
