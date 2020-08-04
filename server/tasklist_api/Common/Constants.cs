using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tasklist_api.Common
{
    public static class Constants
    {
        public const int cancellation_timeout = 30000; //30 seconds

        public const int status_notstarted = 0;
        public const int status_inprogress = 1;
        public const int status_completed = 2;
    }
}
